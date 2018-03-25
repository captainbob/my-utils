package server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.ServerSocket;
import java.net.Socket;

public class Server1 {

    public static void main(String[] args) {
        Server1 a = new Server1();
        a.start();
    }

    private ServerSocket server = null;

    public void start() {
        try {
            server = new ServerSocket(8888);

            this.receive();
        } catch (IOException e) {
            e.printStackTrace();
        }
        try {
            Socket client = server.accept();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private void receive() {
        try {
            Socket client = server.accept();
            StringBuilder sb = new StringBuilder();
            String msg = null;
            BufferedReader br = new BufferedReader(new InputStreamReader(client.getInputStream()));
            while ((msg = br.readLine()).length() > 0) {
                sb.append(msg);
                sb.append("\r\n");
            }
            System.out.println(sb.toString());
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public void stop() {
        try {
            server.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
