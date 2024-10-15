// import { SetMetadata } from '@nestjs/common';
// import { Role } from '../enums/role.enum';

// export const ROLES_KEY = 'roles';
// export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

import { SetMetadata } from '@nestjs/common';
// Import SetMetadata từ @nestjs/common để gán metadata cho các route hoặc class.

import { Role } from '../enums/role.enum';
// Import enum Role để định nghĩa các vai trò (admin, user, etc.) mà route yêu cầu.

export const ROLES_KEY = 'roles';
// Định nghĩa một constant ROLES_KEY để làm khóa lưu trữ metadata.
// Khóa này sẽ được dùng để truy xuất metadata khi cần trong các guard.

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
// Tạo và xuất ra một hàm decorator tên là `Roles`.
// Decorator này sẽ nhận vào một danh sách các vai trò (roles) và sử dụng `SetMetadata` để gán metadata vào handler hoặc class.
// `SetMetadata` gán giá trị `roles` cho `ROLES_KEY`. Khi route được gọi, các guard như `RolesGuard` sẽ sử dụng khóa này để lấy thông tin vai trò từ metadata.
