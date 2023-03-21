import {
  ModelEnvScopes,
  FieldTypes,
  ValidatorsDefinition,
  Data,
  DataModel,
  FieldsDefinition,
  Model,
  models,
} from "@graphand/core";
import ClientAdapter from "./ClientAdapter";

export const generateRandomString = () => {
  return "a" + Math.random().toString(36).substring(7);
};

export const fetchWatcher = async (
  model: typeof Model,
  _id: string,
  operation = "fetch",
  timeout = 1000
) => {
  const adapter = model.__adapter as ClientAdapter;
  let unsub;
  let _timeout;

  return new Promise((resolve) => {
    unsub = adapter.updaterSubject.subscribe((e) => {
      if (e.operation === operation && e.ids.includes(_id)) {
        resolve(true);
      }
    });

    _timeout = setTimeout(() => {
      resolve(false);
    }, timeout);
  }).then((result) => {
    clearTimeout(_timeout);
    unsub();
    return result;
  });
};

export const generateModel = async (
  slug?: string,
  fields: FieldsDefinition = {
    title: {
      type: FieldTypes.TEXT,
    },
  }
) => {
  slug ??= generateRandomString();

  const datamodel = await globalThis.client.getModel(models.DataModel).create({
    name: slug,
    slug,
    fields,
    configKey: "title",
  });

  return globalThis.client.getModel(datamodel.slug);
};

export const mockModel = ({
  scope = ModelEnvScopes.ENV,
  fields = {
    title: {
      type: FieldTypes.TEXT,
      options: {},
    },
  },
  validators = [],
}: {
  scope?: ModelEnvScopes;
  fields?: FieldsDefinition;
  validators?: ValidatorsDefinition;
} = {}) => {
  const uidSlug = generateRandomString();

  class Test extends Data {
    static slug = uidSlug;
    static scope = scope;
    static fields = fields;
    static validators = validators;

    constructor(doc) {
      super(doc);

      this.defineFieldsProperties();
    }

    title;
  }

  Test.__datamodel = new DataModel({
    slug: uidSlug,
    fields,
    validators,
  });

  return Test;
};
