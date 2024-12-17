import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity('revoked_tokens')
export class RevokedToken {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	token: string;

	@CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
	createdAt?: Date;

	@UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
	updatedAt?: Date;
}
