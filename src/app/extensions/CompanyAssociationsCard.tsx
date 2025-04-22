import React, { useEffect, useState, useCallback } from "react";
import {
  Card,
  Text,
  Flex,
  List,
  Checkbox,
  Button,
  LoadingSpinner,
} from "@hubspot/ui-extensions";
import { hubspot } from "@hubspot/ui-extensions";

interface Company {
  id: string;
  name: string;
  associated: boolean;
}

interface CompanyAssociationsCardProps {
  actions: any;
  context: any;
}

const API_BASE_URL = "https://b115-103-89-234-77.ngrok-free.app";

const CompanyAssociationsCard: React.FC<CompanyAssociationsCardProps> = ({
  actions,
  context,
}) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const contactId = context.crm.objectId;
      const endpoint = `${API_BASE_URL}/contacts/${contactId}/companies`;

      const response = await hubspot.fetch(endpoint, {
        timeout: 2_000,
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCompanies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [context.crm.objectId]);

  const handleCompanyAssociation = useCallback(
    async (companyId: string, shouldAssociate: boolean) => {
      try {
        const contactId = context.crm.objectId;
        const endpoint = `${API_BASE_URL}/contacts/${contactId}/companies/${companyId}`;

        const response = await hubspot.fetch(endpoint, {
          timeout: 2_000,
          method: shouldAssociate ? "POST" : "DELETE",
        });

        if (response.ok) {
          setCompanies((prevCompanies) =>
            prevCompanies.map((company) =>
              company.id === companyId
                ? { ...company, associated: shouldAssociate }
                : company
            )
          );
        } else {
          throw new Error(
            `Failed to ${
              shouldAssociate ? "add" : "remove"
            } company association`
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    },
    [context.crm.objectId]
  );

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const renderCompanyList = useCallback(() => {
    if (loading) {
      return (
        <Flex justify="center" gap="sm">
          <LoadingSpinner size="md" label="Loading..." />
        </Flex>
      );
    }

    if (error) {
      return <Text format={{ fontWeight: "bold" }}>{error}</Text>;
    }

    if (companies.length === 0) {
      return <Text>No associated companies found</Text>;
    }

    return (
      <>
        <List>
          {companies.map((company) => (
            <Flex key={company.id} direction="row" gap="md" align="center">
              <Checkbox
                checked={company.associated}
                onChange={(checked) =>
                  handleCompanyAssociation(company.id, checked)
                }
              />
              <Text>{company?.name || "Unnamed Company"}</Text>
            </Flex>
          ))}
        </List>
        <Flex justify="start" gap="md">
          <Button size="medium" variant="primary" onClick={fetchCompanies}>
            Save Associations
          </Button>
        </Flex>
      </>
    );
  }, [loading, error, companies, handleCompanyAssociation, fetchCompanies]);

  return (
    <Flex direction="column" gap="sm">
      <Text>Associated Companies</Text>
      {renderCompanyList()}
    </Flex>
  );
};

hubspot.extend(({ actions, context }) => (
  <CompanyAssociationsCard actions={actions} context={context} />
));

export default CompanyAssociationsCard;
