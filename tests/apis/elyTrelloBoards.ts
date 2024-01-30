import { Page, APIRequestContext, expect } from "@playwright/test";
import { BoardsResponse } from "@type/elyTrelloApi";
import * as dotenv from 'dotenv';
dotenv.config();

export class TrelloBoards {
    getABoard: (id: string) => string;
    page: Page;
    api: APIRequestContext;
    baseUrl: string;
    apiKey: string;
    apiToken: string;
    auth: { key: string; token: string; };

    constructor(driver: Page) {
        this.page = driver
        this.api = this.page.request
        this.getABoard = (id: string) => `/boards/${id}`
        this.baseUrl = process.env.CI ? process.env.TRELLO_ENV_STAGE_BASEURL : process.env.TRELLO_ENV_QA_BASEURL
        this.apiKey = process.env.CI ? process.env.TRELLO_API_CI_KEY : process.env.TRELLO_API_KEY
        this.apiToken = process.env.CI ? process.env.TRELLO_API_CI_TOKEN : process.env.TRELLO_API_TOKEN
        this.auth = {
            key: this.apiKey,
            token: this.apiToken
        }
    }

    async getBoard(givenBoardId: string) {
        const endpoint = this.baseUrl + this.getABoard(givenBoardId)
        const response = await this.api.get(endpoint, { params: this.auth })
        expect(response.ok()).toBe(true)
        const body: BoardsResponse = await response.json()
        return body
    }
}