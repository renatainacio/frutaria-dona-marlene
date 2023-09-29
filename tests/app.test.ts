import httpStatus from "http-status";
import app from "../src/index";
import supertest from "supertest";

const api = supertest(app);

describe("POST /fruits tests", () => {
    it("should return 201 when inserting a fruit", async () => {
        const name = "banana";
        const price = 1.20;
        const response = await api.post("/fruits").send({name, price});
        expect(response.status).toBe(httpStatus.CREATED);
    })

    it("should return 409 when inserting a fruit that is already registered", async () => {
        const name = "banana";
        const price = 2.20;
        const response = await api.post("/fruits").send({name, price});
        expect(response.status).toBe(httpStatus.CONFLICT);
    })

    it("should return 422 when inserting a fruit with data missing", async () => {
        const price = 5.20;
        const response = await api.post("/fruits").send({price});
        expect(response.status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
    })
})

describe("GET /fruits tests", () => {
    it("shoud return 404 when trying to get a fruit by an id that doesn't exist", async () => {
        const response = await api.get("/fruits/1234");
        expect(response.status).toBe(httpStatus.NOT_FOUND);
    })

    it("should return 400 when id param is present but not valid", async () => {
        const response = await api.get("/fruits/abc");
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
    })

    it("should return one fruit when given a valid and existing id", async () => {
        const response = await api.get("/fruits/1");
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
            id: 1,
            name: expect.any(String),
            price: expect.any(Number)
        })
    })

    it("should return all fruits if no id is present", async () => {
        await api.post("/fruits").send({name: "abacaxi", price: 6.70});
        await api.post("/fruits").send({name: "abacate", price: 8.80});
        
        const response = await api.get("/fruits");
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toHaveLength(3);
        expect(response.body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(Number)
                })
            ])
        );
    })
})