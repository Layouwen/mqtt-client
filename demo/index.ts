import { MqttClient, MqttTopicInfo } from "../src";

export const mqttTopicInfoList = [
  {
    key: "event",
    topic: `/+/station/pub/tag/event`,
    opts: {
      qos: 2,
      retain: false,
    },
    handle: (topic: string, data: any) => {
      console.log("handle data", topic, data);
    },
  },
] as MqttTopicInfo[];

export async function mqttInit() {
  const mqttClient = new MqttClient({
    brokerUrl: "mqtt://localhost:1883",
    opts: {
      protocolVersion: 5,
      clientId: "mqtt-client",
      clean: false,
    },
  });

  mqttClient.on("connect", () => {
    console.log("mqtt connect success");
    mqttClient.onSubscribes(mqttTopicInfoList);

    mqttClient.onSubscribe({
      topic: "/+/station/pub/tag/event2",
      opts: {
        qos: 2,
        retain: false,
      },
      handle: (topic) => {
        console.log("mqtt subscribe success", topic);
      },
    });

    mqttClient.publish("/project/station/pub/tag/event2", { event: "test" });
  });

  mqttClient.on("error", (err) => {
    console.error("mqtt connect error", err);
  });

  mqttClient.on("messageReceived", (topic, message) => {
    console.log("mqtt message", topic, message.toString());
  });

  mqttClient.on("messageJsonParseError", (err) => {
    console.error("mqtt message json parse error", err);
  });

  await mqttClient.connect();
}

mqttInit();
