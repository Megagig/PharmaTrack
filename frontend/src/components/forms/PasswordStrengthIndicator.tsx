import { Box, Progress, Text } from '@mantine/core';
import { getPasswordStrength } from '../../utils/formValidation';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = getPasswordStrength(password);
  
  const getStrengthColor = () => {
    switch (strength) {
      case 'weak':
        return 'red';
      case 'medium':
        return 'yellow';
      case 'strong':
        return 'green';
      default:
        return 'gray';
    }
  };
  
  const getStrengthValue = () => {
    switch (strength) {
      case 'weak':
        return 33;
      case 'medium':
        return 66;
      case 'strong':
        return 100;
      default:
        return 0;
    }
  };
  
  const getStrengthText = () => {
    if (!password) return '';
    
    switch (strength) {
      case 'weak':
        return 'Weak password';
      case 'medium':
        return 'Medium strength password';
      case 'strong':
        return 'Strong password';
      default:
        return '';
    }
  };
  
  if (!password) return null;
  
  return (
    <Box mt="xs">
      <Progress value={getStrengthValue()} color={getStrengthColor()} size="xs" mb={5} />
      <Text size="xs" color={getStrengthColor()}>
        {getStrengthText()}
      </Text>
    </Box>
  );
}
