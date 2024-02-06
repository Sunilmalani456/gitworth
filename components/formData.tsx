"use client";

import { promise, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

// @ts-ignore
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ReloadIcon } from "@radix-ui/react-icons";
import { usernameSchema } from "@/lib/UsernameValidator";
import { fetchDataForAllYears } from "@/lib/GetContributions";
import { calculateGitHubWorth } from "@/lib/utils";
import ShowCard from "./showCard";
import { values } from "lodash";

export function ProfileForm() {
  const [data, setData] = useState({});
  const [generated, setGenerated] = useState(false);
  const [Loading, setLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof usernameSchema>>({
    resolver: zodResolver(usernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const fetchData = async (values: any) => {
    try {
      if (values.username === "") return;
      const myUsername: string = values.username.includes("@")
        ? values.username.replace("@", "")
        : values.username;

      const data = await fetch(`https://api.github.com/users/${myUsername}`);
      const finalData = await data.json();

      if (finalData?.message === "Not Found") {
        form.reset();
        return toast.error("Sorry, No Username Found !", {
          style: {
            background: "crimson",
            color: "white",
          },
          position: "top-center",
        });
      } else if (finalData?.type === "Organization") {
        form.reset();
        return toast.error("Sorry, Organisation username not allowed!", {
          position: "top-center",
        });
      }
      const getStar = await fetch(
        `https://api.github.com/users/${myUsername}/repos?per_page=1000`
      );
      const storeStars: Array<any> = await getStar.json();
      // Calculate the total stars
      if (Array.isArray(storeStars)) {
        const totalStars = storeStars.reduce(
          (acc: any, repo: any) => acc + repo.stargazers_count,
          0
        );

        const hereis = await fetchDataForAllYears(myUsername);

        const createData = {
          avatar: finalData.avatar_url,
          fullname: finalData.name,
          username: finalData.login,
          followers: finalData.followers || 0,
          stars: totalStars || 0,
          contribuitions: hereis.total,
          estimated: calculateGitHubWorth(
            hereis.total,
            finalData.followers,
            totalStars
          ),
        };

        // const promise = new Promise((resolve, reject) => {
        //   if (
        //     finalData !== "undefined" &&
        //     finalData !== null &&
        //     storeStars &&
        //     createData
        //   ) {
        //     resolve(finalData);
        //   } else {
        //     reject("Error");
        //   }
        // });

        // toast.promise(promise, {
        //   loading: "Loading...",
        //   success: "Successfully Loaded",
        //   error: "Error!",
        //   position: "top-center",
        // });

        setData(createData);
        console.log({ createData });

        setGenerated(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Rate Limit Reached! Try after some time", {
        style: {
          background: "crimson",
          color: "white",
        },
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof usernameSchema>) => {
    setLoading(true);
    // fetchData(values);
    toast.promise(fetchData(values), {
      loading: "Loading...",
      success: "Successfully Loaded 🤝",
      error: "Error!",
      position: "top-center",
    });

    // try {
    //   if (values.username === "") return;
    //   const myUsername: string = values.username.includes("@")
    //     ? values.username.replace("@", "")
    //     : values.username;

    //   const data = await fetch(`https://api.github.com/users/${myUsername}`);
    //   const finalData = await data.json();

    //   if (finalData?.message === "Not Found") {
    //     form.reset();
    //     return toast.error("Sorry, No Username Found !", {
    //       style: {
    //         background: "crimson",
    //         color: "white",
    //       },
    //       position: "top-center",
    //     });
    //   } else if (finalData?.type === "Organization") {
    //     form.reset();
    //     return toast.error("Sorry, Organisation username not allowed!", {
    //       position: "top-center",
    //     });
    //   }
    //   const getStar = await fetch(
    //     `https://api.github.com/users/${myUsername}/repos?per_page=1000`
    //   );
    //   const storeStars: Array<any> = await getStar.json();
    //   // Calculate the total stars
    //   if (Array.isArray(storeStars)) {
    //     const totalStars = storeStars.reduce(
    //       (acc: any, repo: any) => acc + repo.stargazers_count,
    //       0
    //     );

    //     const hereis = await fetchDataForAllYears(myUsername);

    //     const createData = {
    //       avatar: finalData.avatar_url,
    //       fullname: finalData.name,
    //       username: finalData.login,
    //       followers: finalData.followers || 0,
    //       stars: totalStars || 0,
    //       contribuitions: hereis.total,
    //       estimated: calculateGitHubWorth(
    //         hereis.total,
    //         finalData.followers,
    //         totalStars
    //       ),
    //     };

    //     // const promise = new Promise((resolve, reject) => {
    //     //   if (
    //     //     finalData !== "undefined" &&
    //     //     finalData !== null &&
    //     //     storeStars &&
    //     //     createData
    //     //   ) {
    //     //     resolve(finalData);
    //     //   } else {
    //     //     reject("Error");
    //     //   }
    //     // });

    //     // toast.promise(promise, {
    //     //   loading: "Loading...",
    //     //   success: "Successfully Loaded",
    //     //   error: "Error!",
    //     //   position: "top-center",
    //     // });

    //     setData(createData);
    //     console.log({ createData });

    //     setGenerated(true);
    //   }
    // } catch (error) {
    //   console.log(error);
    //   toast.error("Rate Limit Reached! Try after some time", {
    //     style: {
    //       background: "crimson",
    //       color: "white",
    //     },
    //     position: "top-center",
    //   });
    // } finally {
    //   setLoading(false);
    // }
    // console.log({ data });
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="w-full max-sm:px-4 sm:w-4/12 mb-2">
                <FormControl className="w-full">
                  <Input
                    type="text"
                    id="floating_outlined"
                    className="px-4 py-2 w-full h-[45px] dark:text-white text-black outline-none border focus:border-none border-gray-400 rounded hover:border-gray-600 duration-200 peer focus:border-black dark:focus:border-zinc-200 dark:hover:border-gray-600 dark:border-gray-600 dark:bg-zinc-900 bg-white"
                    placeholder="Github Username"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="" variant={"default"} disabled={Loading}>
            {Loading ? (
              <>
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              "💲 Generate Worth"
            )}
          </Button>
        </form>
      </Form>

      {/* Loder and showCard(userInfo) */}
      {Loading ? (
        <> Please wait calculating your worth 👀...</>
      ) : generated ? (
        <div className="w-full flex flex-col items-center px-2">
          <ShowCard {...data} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
