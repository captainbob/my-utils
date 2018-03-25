
interface Options {
    method: string;
    data?: any;
    headers?: any;
    deconstructResultObject?: boolean;
    timeout?: number
}

interface IHttpUtil {
    setMockJson: (json: any) => void;

    promiseGet(url: string, params: any, headers: any): Promise<any>;

    promisePost(url: string, params: any, headers: any): Promise<any>;

    promiseAjax(url: string, options: Options): Promise<any>;

    ajax(url: string, options: Options): Promise<any>;
}

interface HttpUtil {
    HttpUtil: IHttpUtil
}

export default HttpUtil;