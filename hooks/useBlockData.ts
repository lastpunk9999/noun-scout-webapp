import { useEffect, useMemo, useState } from "react";
let blockSubscription = "0x";
const blockId = 44;
const wssUrl = `wss://eth-${process.env.NEXT_PUBLIC_CHAIN_NAME.toLowerCase()}.alchemyapi.io/v2/${
  process.env.NEXT_PUBLIC_ALCHEMY_API_KEY
}`;
const timeout = 250;

// Websocket Parsing & Sending Message
const parseMessage = (data) => {
  if (!data) return;
  try {
    if (data?.params?.subscription === blockSubscription) {
      return data.params.result;
    } else if (data.id === blockId) {
      blockSubscription = data.result;
    }
  } catch (e) {
    console.error("Error parsing Alchemy websocket message");
    console.error(e);
  }
};

function useBlockData(jsonRpcProvider) {
  const [connectionState, setConnectionState] = useState(0);
  const [message, setMessage] = useState();
  const [httpMessage, setHttpMessage] = useState();

  useEffect(() => {
    // console.log("jsonRpcProvider", !!jsonRpcProvider);
    if (!jsonRpcProvider) return;
    let data = parseMessage(message);
    if (data) return; // console.log("already got ws data");
    if (httpMessage) return; // console.log("already got httpMessage");
    const timerId = setTimeout(() => {
      jsonRpcProvider.getBlock().then((data) => {
        // console.log("http received");
        // console.log(data);
        setHttpMessage(data);
      });
    }, timeout);
    return () => clearTimeout(timerId);
  }, [jsonRpcProvider, message, httpMessage]);

  useMemo(() => {
    if (!httpMessage) return;
    let data = parseMessage(message);
    if (httpMessage && httpMessage.number && data && data.number)
      setHttpMessage();
  }, [httpMessage, message]);

  useEffect(() => {
    // if (connectionState > 0) return;
    let _ws;
    // console.log("setting up WS");
    const timerId = setTimeout(() => {
      // console.log("in WS timeout");
      _ws = new WebSocket(wssUrl);
      _ws.onopen = function open() {
        _ws.send(
          JSON.stringify({
            jsonrpc: "2.0",
            id: blockId,
            method: "eth_subscribe",
            params: ["newHeads"],
          })
        );
        setConnectionState(1);
      };

      _ws.onclose = function close() {
        // console.log("disconnected");

        setConnectionState(0);
      };

      _ws.onmessage = function incoming(data) {
        // console.log("ws data", data);
        setMessage(JSON.parse(data.data));
      };
    }, timeout);

    return () => {
      // console.log("in return fn", !!_ws);
      _ws ? _ws.close() : clearTimeout(timerId);
    };
  }, []);

  const [number, hash] = useMemo(() => {
    let data = parseMessage(message);
    if (httpMessage && httpMessage.number) {
      data = httpMessage;
    }

    if (!data) return []; // Not a new block notification

    const blockNumber = Number(data.number); // Convert from hex
    const blockHash = data.hash;
    return [blockNumber, blockHash];
  }, [message, httpMessage]);
  return [number, hash];
}

export default useBlockData;
