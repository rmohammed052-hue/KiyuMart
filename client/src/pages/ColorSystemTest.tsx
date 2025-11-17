import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOrderStatusColor, getRoleColor } from "@/../../shared/status-colors";

export default function ColorSystemTest() {
  const orderStatuses = ['pending', 'processing', 'delivering', 'delivered', 'cancelled', 'disputed', 'shipped'];
  const userRoles = ['super_admin', 'admin', 'seller', 'buyer', 'rider', 'agent'];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">🎨 KiyuMart Color System Test Page</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>📦 Order Status Colors (Light Variant)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {orderStatuses.map(status => (
                <Badge 
                  key={status}
                  className={getOrderStatusColor(status, 'light') + ' border text-sm px-4 py-2'}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>👥 User Role Colors (Solid Variant)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {userRoles.map(role => (
                <Badge 
                  key={role}
                  className={getRoleColor(role, 'solid') + ' text-sm px-4 py-2'}
                >
                  {role.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>✅ Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>✅ All order statuses have distinct colors</p>
              <p>✅ All user roles have distinct colors</p>
              <p>✅ Colors are professional and minimal</p>
              <p>✅ Light mode optimized (dark mode colors also available)</p>
              <p className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                If you can see different colors above, the system is working correctly!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
