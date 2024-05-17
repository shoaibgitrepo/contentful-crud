import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

interface ContentfulEntry {
  fields: {
    name?: string;
  };
}

const space = "tk24qya26znw";
const accessToken = "AoGTiDm4a3r-OsWsZ05ne6eEPL6PhdLB_gWYFk58Neo";

function App() {
  const [items, setItems] = useState<ContentfulEntry[]>([]);
  useEffect(() => {
    axios
      .get(
        `https://cdn.contentful.com/spaces/${space}/environments/master/entries?content_type=componentDuplex`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then(({ data }) => {
        console.log(data);
        setItems(data.items);
      })
      .catch((error) => {
        console.log(error);
      });
    // client
    //   .getEntries({ content_type: "componentDuplex" })
    //   .then((response) => {
    //     console.log(response);
    //     setItems(response.items);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }, []);

  return (
    <>
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            <div>{item.fields?.name}</div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default App;
