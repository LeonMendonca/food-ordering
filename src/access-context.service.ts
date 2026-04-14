import { Injectable, Scope } from '@nestjs/common';
import { Country } from '@prisma/client';

@Injectable({ scope: Scope.REQUEST })
export class AccessContextService {
  private currentCountry: Country | null = null;
  private currentUserId: string | null = null;

  setContext(userId: string, country: Country) {
    this.currentUserId = userId;
    this.currentCountry = country;
  }

  get country(): Country | null {
    return this.currentCountry;
  }

  get userId(): string | null {
    return this.currentUserId;
  }
}
