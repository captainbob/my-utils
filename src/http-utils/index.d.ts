
export interface HttpUtilAjaxOptions {
    method: string;
    data?: any;
    headers?: any;
    deconstructResultObject?: boolean;
    timeout?: number
}

export interface IHttpUtil {
    setMockJson: (json: any) => void;

    promiseGet(url: string, params: any, headers: any): Promise<any>;

    promisePost(url: string, params: any, headers: any): Promise<any>;

    promiseAjax(url: string, options: HttpUtilAjaxOptions): Promise<any>;

    ajax(url: string, options: HttpUtilAjaxOptions): Promise<any>;
}

declare const HttpUtil:IHttpUtil;

export default HttpUtil;

