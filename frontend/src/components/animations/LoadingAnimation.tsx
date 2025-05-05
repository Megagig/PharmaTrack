import { Box, Center, Text } from '@mantine/core';
import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function LoadingAnimation({ text = 'Loading...', size = 'md' }: LoadingAnimationProps) {
  const dotVariants = {
    initial: {
      y: 0,
    },
    animate: (i: number) => ({
      y: [0, -10, 0],
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        repeat: Infinity,
        repeatType: 'loop',
      },
    }),
  };

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
                custom={i}
                variants={dotVariants}
                initial="initial"
                animate="animate"
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
