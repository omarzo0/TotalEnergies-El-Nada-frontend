import { useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { StationModule as Resource, StationAction as Action, stationPermissions } from '../permissions';

export function usePermissions() {
    const { user } = useAuth();

    const permissions = useMemo(() => {
        if (!user || !user.role) return null;
        return stationPermissions[user.role];
    }, [user]);

    const can = (resource: Resource, action: Action): boolean => {
        if (!permissions) return false;
        const resourcePermissions = permissions[resource];
        if (!resourcePermissions) return false;
        return resourcePermissions.includes(action);
    };

    const hasAnyPermission = (resource: Resource): boolean => {
        if (!permissions) return false;
        const resourcePermissions = permissions[resource];
        return !!resourcePermissions && resourcePermissions.length > 0;
    };

    return {
        can,
        hasAnyPermission,
        role: user?.role,
        isAdmin: user?.role === 'admin',
        isManager: user?.role === 'manager',
        isCashier: user?.role === 'cashier',
        isFinancial: user?.role === 'financial',
    };
}
