import {searchSchema} from "@/lib/validation";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {SearchIcon} from "lucide-react";
import {Dispatch, SetStateAction} from "react";

export const SearchBar = ({query, setQuery}: {query: string, setQuery: Dispatch<SetStateAction<string>>}) => {
    // 1. Define your form.
    const form = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: {
            query: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof searchSchema>) {
        setQuery(values.query);
        console.log("Query Values: ", values);
    }
    return(
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2 items-center">
                    <FormField
                        control={form.control}
                        name="query"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="search for a file by name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button size="sm" type="submit" className="flex gap-1">
                        <SearchIcon /> Search
                    </Button>
                </form>
            </Form>
        </div>
    )
}