package Models

type Topics struct {
	ID       uint      `gorm:"primaryKey"`
	Name     string    `gorm:"unique;not null"`
	Patterns []Pattern `gorm:"foreignKey:TopicID;constraint:OnDelete:CASCADE"`
}

type Pattern struct {
	ID      uint       `gorm:"primaryKey"`
	Name    string     `gorm:"not null"`
	TopicID uint       `gorm:"not null;index"`
	Topic   Topics      `gorm:"constraint:OnDelete:CASCADE"`
	Questions []TopicWiseSheet `gorm:"foreignKey:PatternID;constraint:OnDelete:CASCADE"`
}

type TopicWiseSheet struct {
	ID        uint    `gorm:"primaryKey"`
	Title     string  `gorm:"not null"`
	Link      string  `gorm:"type:text"`
	PatternID uint    `gorm:"not null;index"`
	Pattern   Pattern `gorm:"constraint:OnDelete:CASCADE"`
}
