import { Cookie as CookieData, SetCookie, DeleteCookie } from '../../puppeteer_wrapper/puppeteer_types';
import WendigoModule from '../wendigo_module';
import { WendigoError } from '../../errors';
import { arrayfy } from '../../utils/utils';

export default class BrowserCookies extends WendigoModule {
    public async all(): Promise<{ [s: string]: string }> {
        const cookies = await this._page.cookies();
        return cookies.reduce((acc, cookie: CookieData): { [s: string]: string } => {
            acc[cookie.name] = cookie.value;
            return acc;
        }, {} as { [s: string]: string });
    }

    public async get(name: string, url?: string): Promise<CookieData | void> {
        let cookies: Array<CookieData>;
        if (url) {
            cookies = await this._page.cookies(url);
        } else cookies = await this._page.cookies();
        return cookies.find((cookie) => {
            return cookie.name === name;
        });
    }

    public set(name: string, value: string | SetCookie): Promise<void> {
        let data: SetCookie;
        if (typeof value === 'string') {
            data = {
                name: name,
                value: value
            };
        } else {
            data = Object.assign({}, value, { name: name });
        }
        return this._page.setCookie(data);
    }

    public delete(name: string | Array<string> | DeleteCookie): Promise<void> {
        if (name === undefined || name === null) throw new WendigoError("cookies.delete", "Delete cookie name missing");

        if (this._isDeleteCookieInterface(name)) {
            return this._page.deleteCookie(name);
        }

        const cookiesList = arrayfy(name);
        if (cookiesList.length === 0) return Promise.resolve();
        const cookiesObjects = cookiesList.map((n) => {
            return { name: n };
        });
        return this._page.deleteCookie(...cookiesObjects);
    }

    public async clear(): Promise<void> {
        const cookies = await this._page.cookies();
        const cookiesList = cookies.map(c => c.name);
        return this.delete(cookiesList);
    }

    private _isDeleteCookieInterface(data: any): data is DeleteCookie {
        if (data.name) return true;
        else return false;
    }
}
