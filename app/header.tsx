import {OrganizationSwitcher, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton} from "@clerk/nextjs";
import Link from "next/link";
import {Button} from "@/components/ui/button";

export const Header = () => {
    return (
        <div className="border-b py-4 bg-gray-50">
            <div className="container mx-auto justify-between flex">
                File Manager
                <div className="flex gap-2">
                    <OrganizationSwitcher/>
                    <UserButton/>
                    <SignedOut>
                        <SignInButton>
                            <Button>Sign In</Button>
                        </SignInButton>
                        <SignUpButton>
                            <Button>Sign Up</Button>
                        </SignUpButton>
                    </SignedOut>
                </div>
            </div>
        </div>
    )
}