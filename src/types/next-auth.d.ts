import type { Role, ApplicationRole, NyscStatus } from "@prisma/client";
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: Role;
      applicationRole: ApplicationRole;
      nyscStatus: NyscStatus;
      isVerified: boolean;
    };
  }

  interface User {
    id: string;
    role?: Role;
    applicationRole?: ApplicationRole;
    nyscStatus?: NyscStatus;
    isVerified?: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    applicationRole: ApplicationRole;
    nyscStatus: NyscStatus;
    isVerified: boolean;
  }
}
