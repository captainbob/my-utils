package server;

import java.io.IOException;
import java.net.Socket;

public class Dispatch implements Runnable {
    private Socket   socket;
    private Request  req;
    private Response rep;
    private int      code = 200;

    public Dispatch(Socket client) {
        socket = client;
        try {
            req = new Request(socket.getInputStream());
            // 接受
            rep = new Response(socket.getOutputStream());
        } catch (IOException e) {
            return;
        }
    }

    @Override
    public void run() {
        try {
            Servelet server = WebApp.getServelet(req.getUrl());
            if (null == server) {
                code = 404;
            }
            server.server(req, rep);
            rep.pushToClient(code); // 推送到服务端

        } catch (Exception e) {
            this.code = 500;
        }
        try {
            rep.pushToClient(500);
        } catch (IOException e1) {
            e1.printStackTrace();
        }
        try {
            socket.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
