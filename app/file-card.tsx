import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {Doc} from "@/convex/_generated/dataModel";
import {FileIcon, GanttChartIcon, ImageIcon, MoreVertical, TrashIcon} from "lucide-react";
import {useState} from "react";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useToast} from "@/components/ui/use-toast";
import {Button} from "@/components/ui/button";

const FileCardActions = ({file}: {file: Doc<"files">}) => {
    const { toast } = useToast();
    const deleteFile = useMutation(api.files.deleteFile);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    return (
        <>
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            file and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            try{
                                await deleteFile({fileId: file._id});
                                toast({
                                    variant: "default",
                                    title: "Delete Successful",
                                    description: "file was deleted successfully"
                                });
                            } catch (e) {
                                toast({
                                    variant: "destructive",
                                    title: "Delete failed",
                                    description: "something went wrong while deleting file. Try again later."
                                })
                            }
                        }}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <DropdownMenu>
                <DropdownMenuTrigger><MoreVertical className="w-4 h-6"/></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="flex gap-1 text-red-600 items-center cursor-pointer"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        <TrashIcon className="w-4 h-4"/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}

export const FileCard = ({file}: {file: Doc<"files">}) => {
    return(
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex flex-row">
                    <ImageIcon className="mr-2" />
                    {file.name}
                </CardTitle>
                <div className="absolute top-0.5 right-1">
                    <FileCardActions file={file} />
                </div>
            </CardHeader>
            <CardContent>
                {file.type === "image" && <img width={300} height={300} src={file.fileUrl} alt={file.name}/>}
                {file.type === "csv" && <GanttChartIcon />}
                {file.type === "pdf" && <FileIcon width={150} height={150} />}

            </CardContent>
            <CardFooter className="flex justify-center">
                <Button onClick={() => {
                    window.open(file.fileUrl, "_blank");
                }}>
                    Download
                </Button>
            </CardFooter>
        </Card>
    )
}