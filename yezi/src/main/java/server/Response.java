package server;

import java.io.BufferedWriter;
import java.io.IOException;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.util.Date;

public class Response {
    // 两个常量
    public static final String CRLF    = "\r\n";
    public static final String BLANK   = " ";

    private StringBuilder      headInfo;
    private int                len     = 0;
    // 正文
    private StringBuilder      content = new StringBuilder();

    private BufferedWriter     bw;

    public Response() {
        headInfo = new StringBuilder();
    }

    public Response(OutputStream os) {
        this();
        bw = new BufferedWriter(new OutputStreamWriter(os));
    }

    /**
     * 构建正文
     * @param info
     * @return
     */
    public Response print(String info) {
        content.append(info);
        len += info.getBytes().length;
        return this;
    }

    /**
     * 构建正文+回车
     * @param info
     * @return
     */
    public Response println(String info) {
        content.append(info).append(CRLF);
        len += (info + CRLF).getBytes().length;
        return this;
    }

    /**
     * 构建响应头
     */
    private void createHeaderInfo(int code) {
        headInfo.append("HTTP/1.1").append(BLANK).append(code).append(BLANK);
        switch (code) {
            case 200:
                headInfo.append("OK");
                break;
            case 404:
                headInfo.append("not found");
                break;
            case 500:
                headInfo.append("server error");
                break;
            default:
                break;
        }
        headInfo.append(CRLF);
        headInfo.append("Server: yezi Server/0.0.1").append(CRLF);
        // 时间
        headInfo.append("Date:").append(new Date()).append(CRLF);
        // 正文类型
        headInfo.append("Content-type:text/html;charset=UTF-8").append(CRLF);
        // 正文长度
        headInfo.append("Content-Length:").append(len).append(CRLF);
        headInfo.append(CRLF);
    }

    /**
     * 推送
     * @return
     * @throws IOException 
     */
    public void pushToClient(int code) throws IOException {
        createHeaderInfo(code);
        // 头信息+分割父
        bw.append(headInfo.toString());
        // 正文
        bw.append(content.toString());
        bw.flush();

    }

    public void close() throws IOException {
        bw.close();
    }
}
