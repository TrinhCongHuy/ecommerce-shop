// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Role } from '../enums/role.enum';
// import { ROLES_KEY } from '../decorators/roles.decorator';

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}

//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (!requiredRoles) {
//       return true;
//     }
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;

//     return matchRoles(requiredRoles, user?.role);
//   }
// }

// function matchRoles(requiredRoles: string[], userRole: string[]) {
//   return requiredRoles.some((role: string) => userRole?.includes(role));
// }

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core'; // Import Reflector để truy xuất metadata
import { Role } from '../enums/role.enum'; // Import enum Role chứa các vai trò
import { ROLES_KEY } from '../decorators/roles.decorator'; // Import ROLES_KEY để lấy metadata từ decorator @Roles

@Injectable() // Đánh dấu đây là một service có thể được inject vào các phần khác
export class RolesGuard implements CanActivate {
  // Implement CanActivate để xử lý logic bảo vệ route
  constructor(private reflector: Reflector) {} // Inject Reflector để truy xuất metadata từ route

  // Phương thức canActivate sẽ quyết định liệu request có được phép tiếp tục hay không
  canActivate(context: ExecutionContext): boolean {
    // Sử dụng Reflector để lấy metadata về roles từ handler hoặc class (nếu có)
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(), // Truy xuất metadata từ phương thức handler của route
      context.getClass(), // Nếu không có, truy xuất từ class
    ]);

    // Nếu không có vai trò nào được yêu cầu, cho phép request tiếp tục
    if (!requiredRoles) {
      return true;
    }

    // Lấy request từ context của HTTP để truy xuất thông tin người dùng
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Lấy thông tin người dùng đã được xác thực

    // Kiểm tra nếu vai trò người dùng phù hợp với một trong các vai trò yêu cầu
    return matchRoles(requiredRoles, user?.role);
  }
}

// Hàm so sánh vai trò người dùng với các vai trò yêu cầu
function matchRoles(requiredRoles: string[], userRole: string[]) {
  // Kiểm tra nếu bất kỳ vai trò nào trong requiredRoles xuất hiện trong vai trò của người dùng
  return requiredRoles.some((role: string) => userRole?.includes(role));
}
