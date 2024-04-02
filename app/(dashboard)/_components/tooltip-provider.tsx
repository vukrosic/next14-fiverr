import {
    Tooltip,
    TooltipContent,
    TooltipProvider as BaseTooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface TooltipProviderProps {
    children: React.ReactNode;
    text: string;
}

export const TooltipProvider = ({ children, text }: TooltipProviderProps) => {
    return (
        <BaseTooltipProvider>
            <Tooltip>
                <TooltipTrigger className="flex items-center" asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent>
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </BaseTooltipProvider>
    );
};