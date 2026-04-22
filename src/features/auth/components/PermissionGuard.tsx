import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { StationAction as Action, StationModule as Resource, StationRole as Role } from '../permissions';

interface PermissionGuardProps {
    resource: Resource;
    action: Action;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function PermissionGuard({
    resource,
    action,
    children,
    fallback = null,
}: PermissionGuardProps) {
    const { can } = usePermissions();

    if (!can(resource, action)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

interface RoleGuardProps {
    roles: ('admin' | 'manager' | 'cashier' | 'financial')[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export function RoleGuard({
    roles,
    children,
    fallback = null,
}: RoleGuardProps) {
    const { role } = usePermissions();

    if (!role || !roles.includes(role)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}
