"use client";

import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {Button} from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import {uploadFileSchema} from "@/lib/validation";
import {useState} from "react";
import {useToast} from "@/components/ui/use-toast";
import {Loader2} from "lucide-react";
import {Doc} from "@/convex/_generated/dataModel";

interface UploadFileProps {
    orgId: string | undefined
}


export default function UploadFile({orgId}: {orgId: string | undefined}) {
    const createFile = useMutation(api.files.createFile);
    const generateUploadUrl = useMutation(api.files.generateUploadUrl);
    const { toast } = useToast();
    const [isFileDialogOpen, setIsOpenFileDialog] = useState(false);
    const [isFileSubmitting, setIsFileSubmitting] = useState(false);

    // 1. Define your form.
    const form = useForm<z.infer<typeof uploadFileSchema>>({
        resolver: zodResolver(uploadFileSchema),
        defaultValues: {
            name: "",
            file: undefined,
        },
    })

    const fileRef = form.register("file");

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof uploadFileSchema>) {
        setIsFileSubmitting(true);
        const postUrl = await generateUploadUrl();
        const result = await fetch(postUrl, {
            method: "POST",
            headers: {"Content-Type": values.file[0]!.type},
            body: values.file[0],
        });
        const fileTypeMap = {
            "application/pdf": "pdf",
            "application/csv": "csv",
            "image/png": "image",
            "image/jpeg": "image",
        } as Record<string, Doc<"files">["type"]>;
        const {storageId} = await result.json();

        // save new storage id to database
        await createFile({ name: values.name, fileId: storageId, orgId, type: fileTypeMap[values.file[0].type]});

        // reset form
        form.reset();
        setIsFileSubmitting(false)
        setIsOpenFileDialog(false);

        // alert user that file was uploaded successfully
        toast({
            title: "File uploaded successfully",
            variant: "success",
            description: "Your file is now visible to members of your organization",
        })
    }
    return (
        <Dialog open={isFileDialogOpen} onOpenChange={setIsOpenFileDialog}>
            <DialogTrigger asChild>
                <Button className="bg-blue-950" onClick={() => {

                }}
                >
                    Upload File
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload File</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>File Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="shadcn" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="file"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Select file for upload</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                {...fileRef}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" disabled={isFileSubmitting} className="flex gap-1">
                                {isFileSubmitting && (<Loader2 className="h-4 w-4 mr-1 animate-spin"/>)}
                                {isFileSubmitting ? "Uploading" : "Submit"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
