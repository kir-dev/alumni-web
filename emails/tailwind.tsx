import { Tailwind, TailwindProps } from '@react-email/components';

export function ConfiguredTailwind({ config, children, ...props }: TailwindProps) {
  return (
    <Tailwind
      config={{
        theme: {
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
          extend: {
            colors: {
              primary: {
                50: '#f6f9fc',
                100: '#d0d8e0',
                200: '#a2b1c2',
                300: '#7389a3',
                400: '#456285',
                500: '#163b66',
                600: '#122f52',
                700: '#0d233d',
                800: '#091829',
                900: '#040c14',
              },
            },
          },
        },
        ...config,
      }}
      {...props}
    >
      {children}
    </Tailwind>
  );
}
