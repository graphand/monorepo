import { fetchWatcher, generateModel } from "../../lib/test-utils";
import { Model } from "@graphand/core";

describe("test-utils", () => {
  let model: typeof Model;

  beforeAll(async () => {
    model = await generateModel();
  });

  it("fetchWatcher should returns true if the model has been fetched", async () => {
    const created = await model.create({ title: "title" } as any);

    await expect(fetchWatcher(model, created._id)).resolves.toBeFalsy();

    const fetchSpy = jest.spyOn(globalThis, "fetch");

    expect(fetchSpy).not.toHaveBeenCalled();

    const fetchWatcherPromise = fetchWatcher(model, created._id);

    await model.get({ filter: { _id: created._id } });

    expect(fetchSpy).toHaveBeenCalled();

    await expect(fetchWatcherPromise).resolves.toBeTruthy();
  });
});