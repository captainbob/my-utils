package server;

import java.io.IOException;
import java.net.ServerSocket;

public class Server {
    private boolean isShutDown = false;

    public static void main(String[] args) {
        Server a = new Server();
        a.start();
    }

    private ServerSocket server = null;

    public void start() {
        start(8888);

    }

    public void start(int prot) {
        try {
            server = new ServerSocket(prot);
            this.receive();
        } catch (IOException e) {
            stop();
        }

    }

    private void receive() {
        try {
            while (!isShutDown) {

                new Thread(new Dispatch(server.accept())).start();
            }

        } catch (IOException e) {
            stop();
        }

    }

    public void stop() {
        isShutDown = true;
        try {
            server.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
