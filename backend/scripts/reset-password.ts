import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function resetPassword() {
  try {
    // Email of the user whose password you want to reset
    const userEmail = 'megagigsolution@gmail.com';

    // New password to set
    const newPassword = 'password123';

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const updatedUser = await prisma.user.update({
      where: { email: userEmail },
      data: { password: hashedPassword },
    });

    console.log(`Password reset successful for user: ${updatedUser.email}`);
    console.log(`New password is: ${newPassword}`);
  } catch (error) {
    console.error('Error resetting password:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
