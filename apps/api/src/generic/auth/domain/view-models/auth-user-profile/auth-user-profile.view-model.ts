import { IAuthUserProfileCreateViewModelDto } from "@/generic/auth/domain/dtos/view-models/auth-user-profile-create/auth-user-profile-create-view-model.dto";

/**
 * This class is used to represent a combined auth and user view model for profile.
 */
export class AuthUserProfileViewModel {
	private readonly _userId: string;
	private readonly _authId: string;
	private readonly _email: string | null;
	private readonly _emailVerified: boolean;
	private readonly _lastLoginAt: Date | null;
	private readonly _phoneNumber: string | null;
	private readonly _provider: string;
	private readonly _providerId: string | null;
	private readonly _twoFactorEnabled: boolean;
	private readonly _userName: string;
	private readonly _name: string | null;
	private readonly _lastName: string | null;
	private readonly _bio: string | null;
	private readonly _avatarUrl: string | null;
	private readonly _role: string;
	private readonly _status: string;
	private readonly _createdAt: Date;
	private readonly _updatedAt: Date;

	constructor(props: IAuthUserProfileCreateViewModelDto) {
		this._userId = props.userId;
		this._authId = props.authId;
		this._email = props.email;
		this._emailVerified = props.emailVerified;
		this._lastLoginAt = props.lastLoginAt;
		this._phoneNumber = props.phoneNumber;
		this._provider = props.provider;
		this._providerId = props.providerId;
		this._twoFactorEnabled = props.twoFactorEnabled;
		this._userName = props.userName;
		this._name = props.name;
		this._lastName = props.lastName;
		this._bio = props.bio;
		this._avatarUrl = props.avatarUrl;
		this._role = props.role;
		this._status = props.status;
		this._createdAt = props.createdAt;
		this._updatedAt = props.updatedAt;
	}

	public get userId(): string {
		return this._userId;
	}

	public get authId(): string {
		return this._authId;
	}

	public get email(): string | null {
		return this._email;
	}

	public get emailVerified(): boolean {
		return this._emailVerified;
	}

	public get lastLoginAt(): Date | null {
		return this._lastLoginAt;
	}

	public get phoneNumber(): string | null {
		return this._phoneNumber;
	}

	public get provider(): string {
		return this._provider;
	}

	public get providerId(): string | null {
		return this._providerId;
	}

	public get twoFactorEnabled(): boolean {
		return this._twoFactorEnabled;
	}

	public get userName(): string {
		return this._userName;
	}

	public get name(): string | null {
		return this._name;
	}

	public get lastName(): string | null {
		return this._lastName;
	}

	public get bio(): string | null {
		return this._bio;
	}

	public get avatarUrl(): string | null {
		return this._avatarUrl;
	}

	public get role(): string {
		return this._role;
	}

	public get status(): string {
		return this._status;
	}

	public get createdAt(): Date {
		return this._createdAt;
	}

	public get updatedAt(): Date {
		return this._updatedAt;
	}
}
