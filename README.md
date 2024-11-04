# Mqtt Client

MQTT client wrapper that supports subscription and message handling.

[![Version npm](https://img.shields.io/npm/v/@avanlan/mqtt-client.svg?style=flat-square)](https://www.npmjs.com/package/@avanlan/mqtt-client)
[![NPM Downloads](https://img.shields.io/npm/dw/%40avanlan%2Fmqtt-client)](https://www.npmjs.com/package/@avanlan/mqtt-client)

[![NPM](https://nodei.co/npm/@avanlan/mqtt-client.png?downloads=true&downloadRank=true)](https://nodei.co/npm/@avanlan/mqtt-client/)

## Install

```bash
npm install @avanlan/mqtt-client
```

## Usage

```typescript
import { MqttClient, MqttTopicInfo } from "@avanlan/mqtt-client";

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
    brokerUrl: process.env.MQTT_BROKER_URL || "mqtt://localhost:1883",
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
        console.log("mqtt subscribe success one", topic);
      },
    });

    mqttClient.onSubscribe({
      topic: "/+/station/pub/tag/event2",
      opts: {
        qos: 2,
        retain: false,
      },
      handle: (topic, data) => {
        console.log("mqtt subscribe success two", topic, data);
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
```

## Demo

[mqtt-client-demo](./demo/index.ts)

```bash
npm install
npm run dev
```
