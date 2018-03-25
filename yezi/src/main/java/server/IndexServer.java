package server;

public class IndexServer extends Servelet {
    private String message = "asdfsdf";

    @Override
    public void doGet(Request req, Response rep) {
        rep.println("<html><head><title>椰子demo</title></head>");
        rep.println("<body><div><h1>" + message + "</h1></div></body></html>");
    }

    @Override
    public void doPost(Request req, Response rep) {

    }

}
