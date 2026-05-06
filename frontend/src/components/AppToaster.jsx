import { Toaster } from 'sonner';
import { useTheme } from '@/context/useTheme';

const AppToaster = () => {
    const { resolvedTheme } = useTheme();

    return <Toaster richColors theme={resolvedTheme} />;
};

export default AppToaster;
