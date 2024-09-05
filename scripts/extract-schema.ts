
export async function extractSchema(model: any, definition: string) {
  const result: { definitions: Record<string, any> } = {
    definitions: {},
  };

  const add = (name: string) => {
    const def = model.definitions[name];
    if (!def) {
      throw new Error(`Definition ${name} not found`);
    }

    JSON.stringify(def, (key, value) => {
      if (key === "$ref") {
        const child = value.split("#/definitions/")[1];
        add(child);
      }

      return value;
    });

    result.definitions[name] = def;
  }

  add(definition);

  return result;
}
