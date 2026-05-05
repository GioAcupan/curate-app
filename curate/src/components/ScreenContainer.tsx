import { View, Platform, type ViewProps } from "react-native";

type Props = ViewProps & { className?: string };

export function ScreenContainer({ className, children, ...rest }: Props) {
  return (
    <View className="flex-1 bg-surface-base web:items-center" {...rest}>
      {/* Mesh gradient background */}
      <View
        pointerEvents="none"
        style={Platform.OS === 'web' ? {
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 0,
          background: [
            'radial-gradient(ellipse at 20% 50%, rgba(26,15,0,0.8) 0%, transparent 50%)',
            'radial-gradient(ellipse at 80% 20%, rgba(15,10,26,0.7) 0%, transparent 50%)',
            'radial-gradient(ellipse at 50% 80%, rgba(10,15,26,0.6) 0%, transparent 50%)',
          ].join(', '),
        } as any : {
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
        }}
      />

      {/* Content */}
      <View
        className={`flex-1 w-full web:max-w-md ${className ?? ""}`}
        style={{ zIndex: 1, position: 'relative' }}
      >
        {children}
      </View>

      {/* Grain overlay — web only */}
      {Platform.OS === 'web' && (
        <View
          pointerEvents="none"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 9999,
            opacity: 0.035,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px',
            mixBlendMode: 'overlay',
          } as any}
        />
      )}
    </View>
  );
}
