import fastifyPlugin from "fastify-plugin";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

export default fastifyPlugin(async (fastify) => {
  fastify.register(fastifySwagger, {
    swagger: {
      info: {
        title: "Fastify Mongo DB",
        description: "Example fastify with mongo DB",
        version: "1.0.0",
      },
      schemes: ["http"],
      consumes: ["application/json"],
      produces: ["application/json"],
    },
  });

  fastify.register(fastifySwaggerUi, {
    routePrefix: "/docs",
    uiConfig: { docExpansion: "full" },
  });
});