import { Box, Center, Text } from '@mantine/core';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingAnimation({ text = 'Loading...', size = 'md' }: LoadingAnimationProps) {
  // Define specific types for the variants to match framer-motion's expectations
  const dotVariants = {
    initial: {
      y: 0,
    },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        repeatType: 'loop' as const, // Use 'as const' to specify the exact string literal type
      },
    },
  };
  
  // Custom delay function to be applied separately
  const getCustomDelay = (i: number) => i * 0.1;

  const dotSize = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const spacing = size === 'sm' ? 4 : size === 'md' ? 6 : 8;
  const fontSize = size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg';

  return (
    <Center>
      <Box>
        <Center mb={text ? 10 : 0}>
          <Box style={{ display: 'flex', gap: spacing }}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                variants={dotVariants}
                initial="initial"
                animate="animate"
                transition={{ delay: getCustomDelay(i) }}
                style={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: '50%',
                  backgroundColor: 'currentColor',
                }}
              />
            ))}
          </Box>
        </Center>
        {text && <Text size={fontSize} ta="center">{text}</Text>}
      </Box>
    </Center>
  );
}
