import { Injectable, Scope } from '@nestjs/common';
import { Country, Role } from '@prisma/client';

@Injectable({ scope: Scope.REQUEST })
export class AccessContextService {
  private currentUserId: string;
  private currentRole: Role;
  private currentCountry: Country;

  setContext(userId: string, role: Role, country: Country) {
    this.currentUserId = userId;
    this.currentRole = role;
    this.currentCountry = country;
  }

  get userId(): string {
    return this.currentUserId;
  }

  get role(): Role {
    return this.currentRole;
  }

  get country(): Country {
    return this.currentCountry;
  }

  get isScoped(): boolean {
    return this.currentRole !== 'ADMIN';
  }

  getScopeFilter(otherFilters: any = {}): any {
    if (this.isScoped && this.currentCountry) {
      return { ...otherFilters, country: this.currentCountry };
    }
    return otherFilters;
  }

  hasAnyRole(roles: Role[]): boolean {
    return this.currentRole !== null && roles.includes(this.currentRole);
  }
}
