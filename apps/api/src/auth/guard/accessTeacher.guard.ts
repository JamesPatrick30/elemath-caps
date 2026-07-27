import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class AccessTeacherGuard extends AuthGuard("access-teacher") {}