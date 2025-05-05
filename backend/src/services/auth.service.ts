import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';
import { JwtPayload, LoginRequest, RegisterRequest, UserRole } from '../types';

export class AuthService {
  async register(data: RegisterRequest) {
    const { email, password, role, pharmacyId } = data;
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        pharmacyId
      }
    });
    
    // Generate JWT token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      pharmacyId: user.pharmacyId || undefined
    });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        pharmacyId: user.pharmacyId
      },
      token
    };
  }
  
  async login(data: LoginRequest) {
    const { email, password } = data;
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new Error('Invalid email or password');
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }
    
    // Generate JWT token
    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      pharmacyId: user.pharmacyId || undefined
    });
    
    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        pharmacyId: user.pharmacyId
      },
      token
    };
  }
  
  private generateToken(payload: JwtPayload): string {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );
  }
}
