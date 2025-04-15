"use client"

import { useState,useEffect,useMemo } from "react"
import { motion } from "framer-motion"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ArrowLeftIcon } from "lucide-react"
import type { Proposal } from "@/components/proposals"
import { createProposal } from "../integrate"
import { useProposalContext } from "./context/proposalContext"
import { getDAOParameters } from "@/integrate"

const baseFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  votingPeriodDays: z.number().min(1).max(30),
  targetContract: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
    message: "Must be a valid Ethereum address.",
  }),
  calldata: z.string().regex(/^0x[a-fA-F0-9]+$/, {
    message: "Must be valid hexadecimal calldata.",
  }),
});

type FormValues = z.infer<typeof baseFormSchema>

interface CreateProposalFormProps {
  onSubmit: (values: Omit<Proposal, "id" | "createdAt" | "status" | "votes" | "endDate">) => void
  onCancel: () => void
}

export function CreateProposalForm({ onSubmit, onCancel }: CreateProposalFormProps) {
  const [votingPeriod, setVotingPeriod] = useState(7)
  const { addProposalId } = useProposalContext()
  
  const [daoParams, setDaoParams] = useState({
    minimumTokensToPropose: "0",
    minimumVotingPeriod: 0,
    quorumPercentage: 0
  });
  
  const formSchema = useMemo(()=> z.object({
    title: z.string().min(5, {
      message: "Title must be at least 5 characters.",
    }),
    description: z.string().min(20, {
      message: "Description must be at least 20 characters.",
    }),
    votingPeriodDays: z.number().min(daoParams?.minimumVotingPeriod || 1, {
      message: `Voting period must be at least ${daoParams?.minimumVotingPeriod || 1} days.`
    }).max(30),
    targetContract: z.string().regex(/^0x[a-fA-F0-9]{40}$/, {
      message: "Must be a valid Ethereum address.",
    }),
    calldata: z.string().regex(/^0x[a-fA-F0-9]+$/, {
      message: "Must be valid hexadecimal calldata.",
    }),
  }), [daoParams.minimumVotingPeriod]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      votingPeriodDays: 7,
      targetContract: "0x",
      calldata: "0x",
    },
  })

  async function handleSubmit(values: FormValues) {
    const { title, description, votingPeriodDays, targetContract, calldata } = values;

    try {
      // // Call your integration function
      // const proposalId = await createProposal(description, votingPeriodDays, targetContract, calldata);
      // // Then notify parent component
      // if (proposalId) {
      //   addProposalId(proposalId.toString());
      // }
      onSubmit(values);
    } catch (error) {
      console.error("Error creating proposal:", error);
      // Handle error appropriately
    }
  }

  
  useEffect(() => {
    async function fetchParams() {
      try {
        const params = await getDAOParameters();
        setDaoParams(params);
      } catch (error) {
        console.error("Failed to load DAO parameters:", error);
      }
    }
    
    fetchParams();
  }, []);

  useEffect(() => {
    if (daoParams.minimumVotingPeriod > 0) {
      const minVotingPeriod = daoParams.minimumVotingPeriod;
      
      // Update the local state
      setVotingPeriod(Math.max(votingPeriod, minVotingPeriod));
      
      // Update the form default
      form.setValue('votingPeriodDays', Math.max(form.getValues('votingPeriodDays'), minVotingPeriod));
    }
  }, [daoParams.minimumVotingPeriod]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="border-2 border-primary/10">
        <CardHeader>
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={onCancel} className="mr-2 h-8 w-8">
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <div>
              <CardTitle>Create New Proposal</CardTitle>
              <CardDescription>Fill in the details to create a new governance proposal</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Proposal title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detailed description of the proposal"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="votingPeriodDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voting Period (Days): {votingPeriod}</FormLabel>
                    <FormControl>
                      <Slider
                        min={daoParams.minimumVotingPeriod || 1}
                        max={30}
                        step={1}
                        value={[field.value]}
                        onValueChange={(values) => {
                          // Update both the form field and local state
                          const newValue = values[0];
                          field.onChange(newValue);
                          setVotingPeriod(newValue);
                        }}
                      />
                    </FormControl>
                    <FormDescription>Set how long the voting period will last (1-30 days)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="targetContract"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Contract</FormLabel>
                      <FormControl>
                        <Input placeholder="0x..." {...field} />
                      </FormControl>
                      <FormDescription>The contract address that will be called</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="calldata"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Calldata</FormLabel>
                      <FormControl>
                        <Input placeholder="0x..." {...field} />
                      </FormControl>
                      <FormDescription>The encoded function call data</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
                <Button type="submit">Create Proposal</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
