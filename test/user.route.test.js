import chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from "../index"; // Adjust path and extension based on your project setup

chai.should();
chai.use(chaiHttp);

describe("Testing API", () => {
    describe("POST /users/signup", () => {
        it("It should register a new user", (done) => {
            const user = {
                username: "testuser",
                password: "password123",
                email: "testuser@me.com"
            };
            chai.request(server)
                .post("/users/signup") // Ensure to include leading slash '/'
                .send(user)
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a("object");
                    done();
                });
        });
    });
});
