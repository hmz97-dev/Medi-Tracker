<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260218095814 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE rdv ADD doctor_id INT NOT NULL');
        $this->addSql('ALTER TABLE rdv ADD patient_id INT NOT NULL');
        $this->addSql('ALTER TABLE rdv ADD CONSTRAINT FK_10C31F8687F4FB17 FOREIGN KEY (doctor_id) REFERENCES doctor (id) NOT DEFERRABLE');
        $this->addSql('ALTER TABLE rdv ADD CONSTRAINT FK_10C31F866B899279 FOREIGN KEY (patient_id) REFERENCES patient (id) NOT DEFERRABLE');
        $this->addSql('CREATE INDEX IDX_10C31F8687F4FB17 ON rdv (doctor_id)');
        $this->addSql('CREATE INDEX IDX_10C31F866B899279 ON rdv (patient_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE rdv DROP CONSTRAINT FK_10C31F8687F4FB17');
        $this->addSql('ALTER TABLE rdv DROP CONSTRAINT FK_10C31F866B899279');
        $this->addSql('DROP INDEX IDX_10C31F8687F4FB17');
        $this->addSql('DROP INDEX IDX_10C31F866B899279');
        $this->addSql('ALTER TABLE rdv DROP doctor_id');
        $this->addSql('ALTER TABLE rdv DROP patient_id');
    }
}
