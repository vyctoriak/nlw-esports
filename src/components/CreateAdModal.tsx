import * as Dialog from "@radix-ui/react-dialog";
import * as Checkbox from "@radix-ui/react-checkbox";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { Check, GameController } from "phosphor-react";
import { Input } from "./Form/Input";
import { useEffect, useState, FormEvent } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';

interface Game {
  id: string;
  title: string;
}

export function CreateAdModal() {
  const [games, setGames] = useState<Game[]>([]);
  const [weekDays, setWeekDays] = useState<string[]>([]);
  const [useVoice, setUseVoice] = useState(false);

  useEffect(() => {
    axios("http://localhost:3333/games").then((response) => {
      setGames(response.data);
    });
  }, []);

  async function handleCreateAd(event: FormEvent) {
    event.preventDefault();

    console.log("Enviou o Form!!");

    const formData = new FormData(event.target as HTMLFormElement);

    const data = Object.fromEntries(formData);

    // Validation
    if(!data.name) {
      return;
    }

    try {
      await axios.post(`http://localhost:3333/games/${data.game}/ads`, {
        name: data.name,
        yearsPlaying: Number(data.yearsPlaying),
        discord: data.discord,
        weekDays: weekDays.map(Number),
        hourStart: data.hourStart,
        hourEnd: data.hourEnd,
        useVoiceChannel: useVoice,
      });
      toast.success('Ad created with sucess ');
    } catch (error) {
      console.log(error);
      toast.error("Error to create the ad!");
    }
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/60 inset-0 fixed" />

      <Dialog.Content className="fixed bg-[#2A2634] py-8 px-10 text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg w-[480px] shadow-lg">
        <Dialog.Title className="text-3xl text-white font-black">
          Publish ad
        </Dialog.Title>

        <form onSubmit={handleCreateAd} className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="game" className="font-semibold">
              What is the game?
            </label>
            <select
              name="game"
              id="game"
              className="bg-zinc-900 py-3 px-4 rounded text-sm placeholder:text-zinc-500 appearance-none"
            >
              <option disabled value="" defaultValue=" ">
                Select the game you want to play
              </option>
              {games.map((item) => {
                return (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="name">Your name or nickname</label>
            <Input
              name="name"
              type="text"
              id="name"
              placeholder="How do they call you in the game?"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="yearsPlaying">Years playing?</label>
              <Input
                name="yearsPlaying"
                type="number"
                id="yearsPlaying"
                placeholder="All alright if it's zero :)"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="discord">What is your discord?</label>
              <Input
                name="discord"
                type="text"
                id="discord"
                placeholder="User#0101"
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="weekDays">When you play?</label>
              <ToggleGroup.Root
                type="multiple"
                className="grid grid-cols-4 gap-2"
                value={weekDays}
                onValueChange={setWeekDays}
              >
                <ToggleGroup.Item
                  value="0"
                  className={`w-8 h-8 rounded ${
                    weekDays.includes("0") ? "bg-violet-500" : "bg-zinc-900"
                  } `}
                  title="Domingo"
                >
                  D
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="1"
                  className={`w-8 h-8 rounded ${
                    weekDays.includes("1") ? "bg-violet-500" : "bg-zinc-900"
                  } `}
                  title="Segunda"
                >
                  S
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="2"
                  className={`w-8 h-8 rounded ${
                    weekDays.includes("2") ? "bg-violet-500" : "bg-zinc-900"
                  } `}
                  title="Terça"
                >
                  T
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="3"
                  className={`w-8 h-8 rounded ${
                    weekDays.includes("3") ? "bg-violet-500" : "bg-zinc-900"
                  } `}
                  title="Quarta"
                >
                  Q
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="4"
                  className={`w-8 h-8 rounded ${
                    weekDays.includes("4") ? "bg-violet-500" : "bg-zinc-900"
                  } `}
                  title="Quinta"
                >
                  Q
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="5"
                  className={`w-8 h-8 rounded ${
                    weekDays.includes("5") ? "bg-violet-500" : "bg-zinc-900"
                  } `}
                  title="Sexta"
                >
                  S
                </ToggleGroup.Item>
                <ToggleGroup.Item
                  value="6"
                  className={`w-8 h-8 rounded ${
                    weekDays.includes("6") ? "bg-violet-500" : "bg-zinc-900"
                  } `}
                  title="Sábado"
                >
                  S
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="hourStart">What time of the day?</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  name="hourStart"
                  type="time"
                  id="hourStart"
                  placeholder="From"
                />
                <Input
                  name="hourEnd"
                  type="time"
                  id="hourEnd"
                  placeholder="To"
                />
              </div>
            </div>
          </div>

          <label className="mt-2 flex items-center  gap-2 text-sm">
            <Checkbox.Root
              checked={useVoice}
              className="w-6 h-6 p-1 rounded bg-zinc-900"
              onCheckedChange={(checked) => {
                if (checked === true) {
                  setUseVoice(true);
                } else {
                  setUseVoice(false);
                }
              }}
            >
              <Checkbox.Indicator>
                <Check className="w-4 h-4 text-emerald-400" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            I usually connect to the voice chat
          </label>

          <footer className="mt-4 flex justify-end gap-4">
            <Dialog.Close
              type="button"
              className="bg-zinc-500 px-5 h-12 rounded-md font-semibold hover:bg-zinc-600"
            >
              Cancel
            </Dialog.Close>
            <button
              type="submit"
              className="bg-violet-500 px-5 h-12 rounded-md font-semibold flex items-center gap-3 hover:bg-violet-600"
            >
              <GameController size={24} /> Find duo
            </button>
            <Toaster />
          </footer>
        </form>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
