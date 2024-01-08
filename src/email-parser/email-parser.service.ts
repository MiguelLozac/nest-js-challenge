// src/mail-parsing.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as mailParser from 'mailparser';
import axios, { AxiosResponse } from 'axios';
import * as fs from 'fs/promises';
import * as cheerio from 'cheerio';

@Injectable()
export class EmailParserService {
  async parseEmail(urlOrPath: string): Promise<any> {
    try {
      let emailContent: string;

      // checks if is a URL or a local file path
      if (urlOrPath.startsWith('http')) {
        // Fetch email
        const response: AxiosResponse<string> = await axios.get(urlOrPath);
        emailContent = response.data;
      } else {
        // Read the email local file
        emailContent = await fs.readFile(urlOrPath, 'utf-8');
      }

      // Parsing the email content
      const parsedEmail = await mailParser.simpleParser(emailContent);

      // Extracting JSON from the email attachments or body
      const jsonAttachment = parsedEmail.attachments.find(
        (attachment) => attachment.contentType === 'application/json'
      );

      if (jsonAttachment) {
        // JSON an attachment
        return JSON.parse(jsonAttachment.content.toString());
      } else if (parsedEmail.text) {
        // check for links
        const links: RegExpMatchArray | null = parsedEmail.text.match(/https?:\/\/[^\s]+/g);

        if (links) {
          for (const link of links) {
            try {
              const jsonContent = await this.fetchJsonFromLink(link);
              if (jsonContent) {
                return jsonContent; // If JSON is found, return it
              }
            } catch (error) {
              throw new HttpException('Error fetching JSON from link.', HttpStatus.INTERNAL_SERVER_ERROR);
            }
          }
        }
      }

      // No JSON found
      throw new HttpException('No JSON found in the email.', HttpStatus.NOT_FOUND);
    } catch (error) {
      throw new HttpException('Error parsing email.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async fetchJsonFromLink(link: string): Promise<any> {
    try {
      const response: AxiosResponse<string> = await axios.get(link);
      const contentType = response.headers['content-type'];
    
      if (contentType && contentType.includes('application/json')) {
        return response.data;
      } else if (contentType && contentType.includes('text/html')) {

        const $ = cheerio.load(response.data);
        const jsonLink: string | undefined = $('a[href$=".json"]').attr('href');
        if (jsonLink) {
          const isRelativeURL = !jsonLink.startsWith('http');

          const baseURL: string = response.config.url || '';
          const jsonUrl: string = isRelativeURL ? new URL(jsonLink, baseURL).href : jsonLink;
      
          const nestedJsonResponse: AxiosResponse<any> = await axios.get(jsonUrl);
          return nestedJsonResponse.data;
        }
      }
    } catch (error) {
      throw new HttpException('Error fetching JSON from link.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
