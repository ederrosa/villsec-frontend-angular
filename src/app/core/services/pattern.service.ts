import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatternService {

  private readonly regexUrl: string = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})";
  private readonly regexEmail: string = "([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})";

  constructor() { }

  public getRegexUrl(): string {
    return this.regexUrl;
  }

  public getRegexEmail(): string {
    return this.regexEmail;
  }
}
