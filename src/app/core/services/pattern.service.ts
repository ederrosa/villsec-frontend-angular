import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PatternService {

  private readonly regExpCep: string = "(\d{5}\-?\d{3})";
  private readonly regExpEmail: string = "([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})";
  private readonly regExpOnlyLetters: string = "^[A-zαΰβγιθκνοστυφϊηρ ]+$";
  private readonly regExpPhoneBR: string = "(\(?\d{2}\)?\s?)?(\d{4,5}\-?\d{4})";
  private readonly regExpUrl: string = "(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})";
  
  constructor() { }

  public getRegExpCep(): string {
    return this.regExpCep;
  }

  public getRegExpEmail(): string {
    return this.regExpEmail;
  }

  public getRegExpOnlyLetters(): string {
    return this.regExpOnlyLetters;
  }

  public getRegExpPhoneBR(): string {
    return this.regExpPhoneBR;
  }

  public getRegExpUrl(): string {
    return this.regExpUrl;
  } 
}
