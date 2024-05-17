import { ChangeEvent, useEffect, useState } from "react";
import {
  apiClient,
  deliveryClient,
  spaceId,
} from "./contentful/client";
import { Button, Input } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import AppTable from "./components/AppTable";
import { User, userColumns } from "./columns/User";

interface ContentfulEntry {
  fields: {
    internalName?: string; // Optional in incoming data
  };
  sys: {
    id: string;
  };
}

interface State {
  id?: string;
  internalName?: string;
  loadingPage?: number;
  loadingUpdate?: number;
  loadingCreate?: number;
}

const initialState: State = {
  id: "",
  internalName: "",
  loadingPage: 0,
  loadingUpdate: 0,
  loadingCreate: 0,
};

function App() {
  const [items, setItems] = useState<ContentfulEntry[]>([]);
  const [state, setState] = useState<State>(initialState);

  const setLoadingPage = (loading: boolean) => {
    setState((prev) => ({
      ...prev,
      loadingPage: (prev.loadingPage ?? 0) + (loading ? 1 : -1),
    }));
  };

  const setLoadingUpdate = (loading: boolean) => {
    setState((prev) => ({
      ...prev,
      loadingUpdate: (prev.loadingUpdate ?? 0) + (loading ? 1 : -1),
    }));
  };

  const setLoadingCreate = (loading: boolean) => {
    setState((prev) => ({
      ...prev,
      loadingCreate: (prev.loadingCreate ?? 0) + (loading ? 1 : -1),
    }));
  };

  const loadingPage = (state.loadingPage ?? 0) > 0;
  const loadingUpdate = (state.loadingUpdate ?? 0) > 0;
  const loadingCreate = (state.loadingCreate ?? 0) > 0;

  const fetchEntries = () => {
    setLoadingPage(true);
    deliveryClient
      .getEntries()
      .then((response) => {
        setLoadingPage(false);
        // console.log(response);
        // const items = response.items.map((item) => ({
        //   id: item.sys.id,
        //   internalName: item.fields.internalName,
        // }));
        setItems(response.items);
      })
      .catch((error) => {
        setLoadingPage(false);
        console.log(error);
      });
  };

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const handleSelect = (entry: State) => {
  //   setState(entry);
  // };
  const handleSelect = (item: ContentfulEntry) => {
    setState({
      id: item.sys.id,
      internalName: item.fields.internalName,
    });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, internalName: event.currentTarget.value }));
  };

  const handleSubmit = async () => {
    if (state?.id && state?.internalName) {
      const entryId = state?.id;
      console.log(state);

      setLoadingUpdate(true);
      const space = await apiClient.getSpace(spaceId);
      const env = await space.getEnvironment("master");
      const entryFetched = await env.getEntry(entryId);
      console.log("entry", entryFetched);

      entryFetched.fields.internalName["en-US"] = state?.internalName;
      await entryFetched.update();
      const entryUpdated = await env.getEntry(entryId);
      await entryUpdated.publish();
      setState(initialState);
      setLoadingUpdate(false);
      fetchEntries();
    }
  };

  const handleCreate = async () => {
    if (state?.internalName) {
      setLoadingCreate(true);
      const space = await apiClient.getSpace(spaceId);
      const env = await space.getEnvironment("master");
      const entryNew = await env.createEntry("componentDuplex", {
        fields: { internalName: { "en-US": state.internalName } },
      });

      await entryNew.publish();
      setState(initialState);
      setLoadingCreate(false);
      fetchEntries();
    }
  };

  const handleDelete = (entryId: string) => {
    console.log(entryId);
    setState((prev) => ({ ...prev, id: entryId }));
  };

  const users: User[] = [
    {
      key: 1,
      name: "John Brown",
      age: 32,
      address: "New York No. 1 Lake Park",
    },
    {
      key: 2,
      name: "Jim Green",
      age: 42,
      address: "London No. 1 Lake Park",
    },
    {
      key: 3,
      name: "Joe Black",
      age: 32,
      address: "Sidney No. 1 Lake Park",
    },
  ];

  return (
    <>
      <AppTable<User>
        loading={loadingPage}
        columns={userColumns}
        data={users}
        pagination={{ pageSize: 5 }}
      />
      <ul>
        {items.map((item, index) => (
          <li
            style={{ margin: 8 }}
            key={index}
            onClick={() => handleSelect(item)}
          >
            <div>
              <Button onClick={() => handleDelete(item.sys.id)}>
                <DeleteFilled />
              </Button>
              {item.sys.id} - {item.fields?.internalName}
            </div>
          </li>
        ))}
      </ul>

      <div>
        <Input
          style={{ width: 224, margin: 8, marginLeft: 32 }}
          placeholder="Enter Name"
          value={state?.internalName}
          onChange={handleChange}
        />
        <Button
          style={{ marginRight: 8 }}
          loading={loadingUpdate}
          type="primary"
          onClick={handleSubmit}
        >
          Update
        </Button>
        <Button loading={loadingCreate} type="primary" onClick={handleCreate}>
          Create
        </Button>
      </div>
    </>
  );
}

export default App;
