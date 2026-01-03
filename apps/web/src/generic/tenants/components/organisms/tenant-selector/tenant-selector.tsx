"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@repo/shared/presentation/components/ui/dialog";
import { Button } from "@repo/shared/presentation/components/ui/button";
import { Input } from "@repo/shared/presentation/components/ui/input";
import { Label } from "@repo/shared/presentation/components/ui/label";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/shared/presentation/components/ui/dropdown-menu";
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { useTenantCurrent } from "@/generic/tenants/hooks/use-tenant-current/use-tenant-current";
import { useRouter } from "next/navigation";

interface TenantSelectorProps {
	children?: React.ReactNode;
}

/**
 * Component that allows users to create or switch between tenants (Clerk organizations)
 */
export function TenantSelector({ children }: TenantSelectorProps) {
	const { organization, setActive } = useOrganization();
	const { user } = useUser();
	const { refetch: refetchTenant } = useTenantCurrent();
	const router = useRouter();
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
	const [isCreating, setIsCreating] = useState(false);
	const [orgName, setOrgName] = useState("");

	// Get user's organizations
	const { organizationList, isLoaded, setUserMemberships } = useOrganizationList({
		userMemberships: {
			infinite: true,
		},
	});

	/**
	 * Handles creating a new organization in Clerk
	 */
	const handleCreateOrganization = async () => {
		if (!user || !orgName.trim()) return;

		setIsCreating(true);
		try {
			// Create organization in Clerk
			const newOrg = await setUserMemberships.create({
				name: orgName.trim(),
			});

			// Set as active organization
			if (newOrg && newOrg.id) {
				await setActive({ organization: newOrg.id });
			}

			// Refetch tenant data (backend will create tenant lazily)
			await refetchTenant();

			// Refresh the page to update the tenant context
			router.refresh();

			setCreateDialogOpen(false);
			setOrgName("");
		} catch (error) {
			console.error("Failed to create organization:", error);
		} finally {
			setIsCreating(false);
		}
	};

	/**
	 * Handles switching to a different organization
	 */
	const handleSwitchOrganization = async (orgId: string) => {
		try {
			await setActive({ organization: orgId });
			// Refetch tenant data
			await refetchTenant();
			// Refresh the page to update the tenant context
			router.refresh();
		} catch (error) {
			console.error("Failed to switch organization:", error);
		}
	};

	if (!isLoaded) {
		return children || null;
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					{children || (
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<ChevronDown className="h-4 w-4" />
						</Button>
					)}
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-56">
					<DropdownMenuLabel>Tenants</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{organizationList?.map(({ organization: org }) => (
						<DropdownMenuItem
							key={org.id}
							onClick={() => handleSwitchOrganization(org.id)}
							className={
								organization?.id === org.id ? "bg-accent" : ""
							}
						>
							{org.name}
							{organization?.id === org.id && (
								<span className="ml-auto text-xs">✓</span>
							)}
						</DropdownMenuItem>
					))}
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => setCreateDialogOpen(true)}>
						<Plus className="mr-2 h-4 w-4" />
						Create Tenant
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>

			<Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Tenant</DialogTitle>
						<DialogDescription>
							Create a new organization in Clerk. This will automatically
							create a tenant in the system.
						</DialogDescription>
					</DialogHeader>
					<div className="py-4 space-y-4">
						<div className="space-y-2">
							<Label htmlFor="org-name">Tenant Name</Label>
							<Input
								id="org-name"
								placeholder="Enter tenant name"
								value={orgName}
								onChange={(e) => setOrgName(e.target.value)}
								disabled={isCreating}
								onKeyDown={(e) => {
									if (e.key === "Enter" && orgName.trim() && !isCreating) {
										handleCreateOrganization();
									}
								}}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => {
								setCreateDialogOpen(false);
								setOrgName("");
							}}
							disabled={isCreating}
						>
							Cancel
						</Button>
						<Button
							onClick={handleCreateOrganization}
							disabled={isCreating || !orgName.trim()}
						>
							{isCreating ? "Creating..." : "Create Tenant"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

