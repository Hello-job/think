import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('text_comment_reply')
export class TextCommentEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column({ type: 'varchar', length: 100, comment: '文本评论id' })
  public: string;

  @Column({ type: 'varchar', length: 500, comment: '回复内容' })
  public content: string;

  @Column({ type: 'varchar', length: 50, comment: '用户id' })
  public userId: string;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'createdAt',
    transformer: {
      to(value: Date): number {
        return value.getTime(); // 转换为时间戳
      },
      from(value: number): Date {
        return new Date(value); // 转换回日期对象
      },
    },
  })
  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updatedAt',
    comment: '更新时间',
  })
  createdAt: Date;
}
